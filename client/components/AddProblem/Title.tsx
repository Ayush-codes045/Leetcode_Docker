"use client";
import { useContent } from "@/hook/content";
import React from "react";
import { Button } from "../ui/button";
import { AiOutlineUpload } from "react-icons/ai";
import { toast } from "sonner"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { useSession } from "next-auth/react";
import { PublishAction } from "@/actions/publish";
import { useRouter } from "next/navigation";

const Title = () => {
  const [difficulty, setDifficulty] = React.useState("Easy");
  const {title,description,testCases} = useContent()
  const session = useSession()
  const router = useRouter()
  const publish = async() => {
    if (session.data) {
      const id = (session.data?.user as { id?: string })?.id || ""
      if(!title || !description || !testCases) return toast("Please fill all the fields")
      await PublishAction(title,description,testCases, id, difficulty)
      router.push("/")
    }
  };
  return (
    <div className=" flex items-center  p-10 justify-between">
      <div className="text-2xl font-bold ">Add Problem</div>
      <div className=" flex gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex gap-2">
              <div>Difficulty</div>
              <MdOutlineArrowDropDown size={20} className=" text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={difficulty}
              onValueChange={setDifficulty}
            >
              <DropdownMenuRadioItem value="Easy">Easy</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Medium">
                Medium
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Hard">Hard</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={publish} className="flex gap-2">
          <div>Publish</div>
          <AiOutlineUpload size={20} className=" text-white" />
        </Button>
      </div>
    </div>
  );
};

export default Title;
