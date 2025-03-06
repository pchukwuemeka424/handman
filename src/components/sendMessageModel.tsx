"use client";

import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaEye, FaFileAlt } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";

import { FaF, FaMessage } from "react-icons/fa6";
import Message from "./message";



export default function SendMessageModel({ userDetail }: any) {


  return (
    <Dialog>
      <DialogTrigger asChild>
        <span>
          <Button className="flex items-center justify-center w-full  gap-2 border-black border-2 bg-white text-black py-4 px-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105">
            <FaMessage className="mr-2" />
            Send a Message
          </Button>
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Message</DialogTitle>
        
        </DialogHeader>

        <Message userDetail={userDetail} />
      </DialogContent>
    </Dialog>
  );
}
