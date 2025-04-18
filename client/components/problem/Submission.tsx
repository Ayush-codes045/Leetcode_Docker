"use client"
import { getSubmission } from "@/actions/getSubmission";
import {useEffect, useState } from "react";
import { Card, CardHeader } from "../ui/card";
import { Submission } from "@prisma/client";
import { useParams } from "next/navigation";
const SubmissionComp =  ({session}: any) => {
    const { id }: any = session;
    const {problemId}:{problemId:string} = useParams();
    const [submission, setSubmission] = useState<any>(null);

    const formatTime = (createdAt: Date) => {
        const currentTime = new Date();
        const submissionTime = new Date(createdAt);
        const timeDifference = Math.abs(currentTime.getTime() - submissionTime.getTime());
        const minutes = Math.floor(timeDifference / (1000 * 60));
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (minutes < 60) {
            return `${minutes} min ago`;
        } else if (hours < 24) {
            return `${hours} hour ago`;
        } else {
            return `${days} days ago`;
        }
    };

    useEffect(() => {
        getSubmission(id,problemId).then((data) => {
            setSubmission(data);
        }).catch((error) => {
            console.log(error);
        });
    }, [id,problemId]);

    return <div>{
       submission && submission.length>0? submission && submission.map((sub: Submission,index:any) => {
        return (
            <Card key={sub.id} className="m-2">
                <CardHeader>
                    <div className="flex justify-between">
                        <div>
                            <div>{formatTime(sub.createdAt).toString()}</div>
                        </div>
                        <div className={`${sub.status === "ACCEPTED" ? "text-green-700" : "text-red-700"}`}>{sub.status}</div>
                    </div>
                </CardHeader>
            </Card>
        );
    }):<div className=" px-4 py-2  font-semibold">No submission yet</div>
    }</div>;
};

export default SubmissionComp;
