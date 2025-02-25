"use client"
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import QuestionsSection from './_components/QuestionsSection'
import RecordAnswerSection from './_components/RecordAnswerSection'


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
            
            />
        </div>

    </div>
  )
}

export default StartInterview