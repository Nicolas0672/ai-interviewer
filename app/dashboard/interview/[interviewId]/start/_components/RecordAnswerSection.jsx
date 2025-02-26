"use client"
import { Button } from '@/components/ui/button'
import { db } from '@/utils/db';
import { chatSession } from '@/utils/GeminiAIModel';
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { and, eq } from 'drizzle-orm';
import { Mic } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import useSpeechToText from 'react-hook-speech-to-text';
import Webcam from 'react-webcam'
import { toast } from 'sonner';

function RecordAnswerSection({interviewData,setUserAnswer, userAnswer, activeQuestionIndex, mockInterviewQuestion}) {
    const {user} = useUser()
    const [loading, setLoading] = useState(false)
    
    const prevAnsRef = useRef("");
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults,
      } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
      });

      useEffect(()=>{
        if (results.length > 0) {
            const newAnswer = [...userAnswer]
            newAnswer[activeQuestionIndex] = results.map(r => r.transcript).join(" ")
            setUserAnswer(newAnswer);
            
        }
      }, [results])

      useEffect(() =>{
        prevAnsRef.current = userAnswer[activeQuestionIndex] || ""
      }, [activeQuestionIndex])

      useEffect(() => {
        
        setUserAnswer(prevAnswers => {
            const newAnswers = [...prevAnswers];
            if (!newAnswers[activeQuestionIndex]) newAnswers[activeQuestionIndex] = ""; // Ensure it's defined
            return newAnswers;
        });
        
    }, [activeQuestionIndex]);

      useEffect(() =>{
        if(!isRecording&&userAnswer[activeQuestionIndex]?.length>10){
          if(userAnswer[activeQuestionIndex] !== prevAnsRef.current){
            UpdateUserAnswerInDb()
          }
        }
      }, [userAnswer[activeQuestionIndex]])

      const saveUserAnswer = async () =>{
       
        if(isRecording){
          
          stopSpeechToText()
          /*if(userAnswer[activeQuestionIndex]?.length < 10){
            setLoading(false)
            toast('Error. Please Record Longer')
            return ;
          }
            */
        }
        else{
          startSpeechToText()
        }
      }

      const resetRecording = () =>{
        setUserAnswer(prevAnswers =>{
          const newAns = [...prevAnswers]
          newAns[activeQuestionIndex] = ""
          return newAns
        })
        setResults([])
        prevAnsRef.current=""
      }

      const UpdateUserAnswerInDb= async () =>{
        setLoading(true)
        
        const feedbackPrompt = `
          You are a professional interview coach. Analyze the following answer and provide feedback.

          Question: "${mockInterviewQuestion[activeQuestionIndex]?.question}"
          User Answer: "${userAnswer[activeQuestionIndex]}"

          Provide feedback with:
          1. A rating (integer from 1 to 10) assessing the quality of the answer.
          2. A brief constructive feedback message in **one or two sentences**.

          **Output MUST be in this exact JSON format (no extra text before or after JSON):**
          \`\`\`json
          {
            "rating": <integer from 1 to 10>,
            "feedback": "<brief constructive feedback>"
          }
          \`\`\`
          Do NOT include any explanations outside of this JSON format.
          `;
        const result = await chatSession.sendMessage(feedbackPrompt)

        const mockJsonResp=(result.response.text()).replace('```json', '').replace('```', '')
        
        const existingAnswer = await db.select().from(UserAnswer).where(and(
          eq(UserAnswer.mockIdRef, interviewData?.mockId),
          eq(UserAnswer.question, mockInterviewQuestion[activeQuestionIndex]?.question),
          eq(UserAnswer.userEmail, user?.primaryEmailAddress.emailAddress)
        ))
        .limit(1)

        const existingRecord = existingAnswer[0]

        const JsonFeedBackResp=JSON.parse(mockJsonResp)
        if(existingRecord){
          
          await db.update(UserAnswer).set({
            userAns: userAnswer[activeQuestionIndex],
            feedback: JsonFeedBackResp?.feedback,
            rating: JsonFeedBackResp?.rating,
            createdAt: moment().format("MM-DD-YYYY")
          })
          .where(
            and(
              eq(UserAnswer.mockIdRef, interviewData?.mockId),
              eq(UserAnswer.question, mockInterviewQuestion[activeQuestionIndex]?.question),
              eq(UserAnswer.userEmail, user?.primaryEmailAddress.emailAddress)
            )
          );
          toast('Answer Updated Successfully');
        }
        else {
          
          await db.insert(UserAnswer).values({
          mockIdRef:interviewData?.mockId,
          question:mockInterviewQuestion[activeQuestionIndex]?.question,
          correctAns:mockInterviewQuestion[activeQuestionIndex]?.answer,
          userAns:userAnswer[activeQuestionIndex],
          feedback:JsonFeedBackResp?.feedback,
          rating:JsonFeedBackResp?.rating,
          userEmail:user?.primaryEmailAddress.emailAddress,
          createdAt: moment().format('DD-MM-YYYY')
        })
        toast('User Answer Recorded Sucessfully')
      }
        setResults([])
        setLoading(false)
      }


  return (
    <div className='flex items-center justify-center flex-col'>
        <div className='flex flex-col my-9 justify-center bg-black items-center rounded-lg border p-5'>
            <Image src={'/webcam.png'} width={200} height={200} alt="logo" priority
            className='absolute'/>
            <Webcam
            mirrored={true}
            style={{
                height:300,
                width:'100%',
                zIndex:10,
            }}/>

        </div>
        <div className="ml-10 justify-center my-6">
        <Button disabled={loading} varaint='outline' 
        onClick={saveUserAnswer}
        >
            {isRecording?
            <h2 className='text-red-700 flex gap-2'>
                <Mic/> Stop Recording
            </h2>
            : "Record Answer"}
          </Button>
                
          {userAnswer[activeQuestionIndex]?.length> 0 &&(
            <Button varaint = 'outline' onClick={resetRecording}className='ml-4 bg-red-500 text-white'>
              Clear Answer
            </Button>)}
            </div>
            
    </div>
  )
}

export default RecordAnswerSection