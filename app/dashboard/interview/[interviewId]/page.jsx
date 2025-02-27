"use client"
import { Button } from '@/components/ui/button'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { Lightbulb, WebcamIcon } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'


function Interview() {
    const [interviewData, setInterviewData] = useState();
    const [webcamEnabled, setWebcamEnabled] = useState(false);
    const params = useParams()
    useEffect(()=>{
        GetInterviewDetails()
    }, [])
    const GetInterviewDetails=async()=>{
        const result = await db.select().from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId))
        setInterviewData(result[0])
    }
    if (!interviewData) return null;
  return (
    <div className='my-8'>
        <h2 className='font-bold text-2xl'>Let's Get Started</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10 my-5'>
        
        <div className='flex flex-col my-5 gap-20'>
            <div className=' p-5 rounded-lg border'>
            <h2 className='text-lg my-1'><strong>Job Role/Job Position:</strong> {interviewData.jobPosition}</h2>
            <h2 className='text-lg my-1'><strong>Job Description:</strong> {interviewData.jobDes}</h2>
            <h2 className='text-lg my-1'><strong>Years of Experience:</strong> {interviewData.jobExperience}</h2>
            </div>
            <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
                <h2 className='flex gap-2 items-center text-yellow-400'><Lightbulb/><strong>Information</strong></h2>
                <h2 className='mt-3 text-yellow-500'>Enable your webcam and microphone to start your AI-generated mock interview. The session includes five questions, and you'll receive a personalized report based on your answers. <strong>NOTE:</strong> Your information is kept secure, and you can disable the webcam at any time.
                </h2>
            </div>
        </div>
        <div className=''>
            {webcamEnabled ? <Webcam
            onUserMedia={() => setWebcamEnabled(true)}
            onUserMediaError={() => setWebcamEnabled(false)}
            mirrored={true}
            style={{
                height:300,
                width:'100%',
                zIndex:10,
            }}/> :
            <>
            <WebcamIcon className='h-72 w-full my-5 p-20 bg-secondary rounded-lg border'/>
            <Button variant='ghost' className='w-full'onClick={() => setWebcamEnabled(true)}>Enable Web Cam</Button>
            </>
            
            }
        </div>
        </div>
        <div className='flex justify-end items-end'>
        <Link href={'/dashboard/interview/'+params.interviewId+'/start'}>
        <Button >Start Interview</Button>
        
        </Link>  
        
        </div>
        
    </div>
  )
}

export default Interview