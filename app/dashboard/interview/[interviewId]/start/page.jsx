"use client"
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import QuestionsSection from './_components/QuestionsSection'
import RecordAnswerSection from './_components/RecordAnswerSection'
import { Button } from '@/components/ui/button'
import Link from 'next/link'


function StartInterview() {
    const [userAnswer, setUserAnswer] = useState([])
    const [interviewData, setInterviewData] = useState()
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState()
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
    const params = useParams()
    useEffect(() =>{
        GetInterviewDetails()
    },[])

    const GetInterviewDetails=async()=>{
            const result = await db.select().from(MockInterview)
            .where(eq(MockInterview.mockId, params.interviewId))
            
            const jsonMockResp = JSON.parse(result[0].jsonMockResp)
            setMockInterviewQuestion(jsonMockResp)
            setInterviewData(result[0])
            setUserAnswer(new Array(jsonMockResp.length).fill(""))
        }

        if(!mockInterviewQuestion) return null;
        

  return (
    <div>
        <div className='grid grid-cols-1 mt-14 md:grid-cols-2 gap-10'>
            <QuestionsSection 
            mockInterviewQuestion={mockInterviewQuestion}
            activeQuestionIndex={activeQuestionIndex}
            userAnswer={userAnswer}
            />
            <RecordAnswerSection 
                setUserAnswer={setUserAnswer}
                userAnswer={userAnswer}
                activeQuestionIndex={activeQuestionIndex}
                mockInterviewQuestion={mockInterviewQuestion}
                interviewData={interviewData}
            />
        </div>
        <div className='mt-5 flex justify-between gap-6 '>
            {activeQuestionIndex>0&&
            <Button className=" "onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>Previous Question</Button>}
            {activeQuestionIndex != mockInterviewQuestion?.length-1&& 
            <Button className=" mr-20"onClick={() => setActiveQuestionIndex(activeQuestionIndex+ 1)}>Next Question</Button>}
            {activeQuestionIndex==mockInterviewQuestion?.length-1&& 
            <Link href={'/dashboard/interview/' + interviewData?.mockId+'/feedback'}>
            <Button>End Interview</Button>
            </Link>}
        </div>
    </div>
  )
}

export default StartInterview