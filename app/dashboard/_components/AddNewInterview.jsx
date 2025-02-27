"use client"
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { v4 as uuidv4 } from 'uuid';



import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { chatSession } from '@/utils/GeminiAIModel'
import { LoaderCircle } from 'lucide-react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { useRouter } from 'next/navigation';
  
function AddNewInterview() {
    const [isClient, setIsClient] = useState(false)
    const[openDialogue, setOpenDialogue] = useState(false)
    const [jobPosition, setJobPosition] = useState();
    const [jobDes, setJobDes] = useState();
    const [jobExperience, setJobExperience] = useState();
    const [loading, setLoading] = useState(false);
    const [JsonResponse, setJsonResponse] = useState([])
    const router=useRouter();
    const {user} = useUser();

    useEffect(()=>{
        setIsClient(true)
    },[])

    const onSubmit=async(e)=>{
        setLoading(true)
        e.preventDefault()
        const InputPrompt = `
                Generate ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT || 5} interview questions based on the following details:

                - **Job Position**: ${jobPosition}
                - **Job Description**: ${jobDes}
                - **Years of Experience**: ${jobExperience}

                Return **ONLY** a JSON array in the following format (nothing before or after):

                \`\`\`json
                [
                {
                    "question": "<interview question>",
                    "answer": "<ideal answer>"
                },
                {
                    "question": "<interview question>",
                    "answer": "<ideal answer>"
                }
                ]
                \`\`\`

                Ensure valid, parseable JSON. Do NOT include explanations, markdown, or extra text.
                `;
        const result = await chatSession.sendMessage(InputPrompt)
        
        const MockJsonResp = (result.response.text()).replace('```json', '').replace('```', '')
        setJsonResponse(MockJsonResp)
        if(MockJsonResp){
        const resp = await db.insert(MockInterview)
        .values({
            mockId:uuidv4(),
            jsonMockResp:MockJsonResp,
            jobPosition:jobPosition,
            jobDes:jobDes,
            jobExperience:jobExperience,
            createdBy:user?.primaryEmailAddress?.emailAddress,
            createdAt:moment().format("DD-MM-yyyy")
        }).returning({mockId:MockInterview.mockId})
        
        if(resp){
            setOpenDialogue(false)
            router.push('/dashboard/interview/'+resp[0]?.mockId)
        }
        }

        setLoading(false);
    }
    if(!isClient){
        return null;
    }
  return (
    <div>
        <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all
        '
        onClick={() => setOpenDialogue(true)}
        >
            <div> 
            <h2 className=' text-lg text-center'>+ Add New</h2>
            </div>
        </div>
        <Dialog open={openDialogue} onOpenChange={(open) => setOpenDialogue(open)}>
        
        <DialogContent className='max-w-2xl'>
            <DialogHeader>
            <DialogTitle className='text-2xl'>Tell us more about your job interview</DialogTitle>
            <DialogDescription>
                <form onSubmit={onSubmit}>
                <div>                   
                    
                    <h2>Add Details about your job position/role, job description and years of experience</h2>
                    <div className='mt-7 my-5'>
                        <label>Job Role Position</label>
                        <Input placeholder="Ex. Full Stack Developer" required
                        onChange={(event) => setJobPosition(event.target.value)}
                        />
                    </div>
                    <div className=' my-5'>
                        <label>Job Description/ Tech Stack</label>
                        <Textarea placeholder="Ex. React, Angular, NodeJs ect" required
                        onChange={(event) => setJobDes(event.target.value)}
                        />
                    </div>
                    <div className=' my-5'>
                        <label>Years of experience</label>
                        <Input placeholder="Ex. 5" type="number" max="50"required
                        onChange={(event) => setJobExperience(event.target.value)}/>
                    </div>
                </div>
                <div className='flex gap-5 justify-end'>
                    <Button type="button" variant="ghost" onClick={() => setOpenDialogue(false)}>Cancel</Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 
                        <><LoaderCircle className='animate-spin'/>Generating from AI</>:'Start Interview'}
                        </Button>
                </div>
            </form>
            </DialogDescription>
            </DialogHeader>
        </DialogContent>
        </Dialog> 

    </div>
  )
}

export default AddNewInterview