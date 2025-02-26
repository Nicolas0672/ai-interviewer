"use client"
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'


function Feedback() {
    const params = useParams()
    const [feedbackList, setFeedbackList] = useState([])
    const [overallRating, setOverallRating] = useState(0)
    const route = useRouter()
    useEffect(() =>{
        GetFeedback()
    }, [])
    
    const GetFeedback= async ()=>{
        const result = await db.select().from(UserAnswer).where(eq(UserAnswer.mockIdRef, params.interviewId))
        .orderBy(UserAnswer.id)
        setFeedbackList(result)
        if(result.length > 0){
          const ratings = result.map(item => item.rating)
            
          const totalRating = result.reduce((acc, item) => {
            const rating = Number(item.rating)
            return !isNaN(rating) ? acc + rating : acc
          }, 0)
          
          const avgRating = result.length > 0 ? totalRating / result.length : 0
         
          setOverallRating(avgRating.toFixed(2))
        }
    }
  return (
    <div className='p-10'>
        
        {feedbackList?.length == 0?
        <h2 className='font-bold text-xl text-gray-500'>No Interview Feedback Record Found</h2> :
        <>
        <h2 className='text-2xl font-bold text-green-500'>Congratulation!</h2>
        <h2 className='text-2xl font-bold'>Here is your interview report</h2>
        <h2 className='text-primary text-lg my-3'>Your overall interview rating: <strong>{overallRating}/10</strong></h2>
        <h2 className='text-sm text-gray-500'>Find below your interview questions with the ideal response, your answer and feedback for improvements</h2>
        {feedbackList&&feedbackList.map((item, index) =>{
            return(
            <Collapsible className='mt-7'key={index}>
            <CollapsibleTrigger className='w-full gap-7 flex justify-between my-2 p-2 bg-secondary rounded-lg text-left'>
            {item.question} <ChevronsUpDown className='ml-4 h-5 w-5'/>
            
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className='flex flex-col gap-2'>
                
                <h2 className='text-red-400 p-2 border rounded-lg'><strong>Rating: </strong>{item.rating}</h2>
                <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-700'><strong>Your Answer: </strong>{item.userAns}</h2>
                <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-700'><strong>Correct Answer: </strong>{item.correctAns}</h2>
                <h2 className='p-2 border rounded-lg bg-blue-50 text-sm text-primary'><strong>Feedback: </strong>{item.feedback}</h2>
              </div>
            </CollapsibleContent>
          </Collapsible>
            )
          
        })}
        </>
        }

        <Button className='mt-5'onClick={()=> route.replace('/dashboard')}>Go Home</Button>
    </div>
  )
}

export default Feedback