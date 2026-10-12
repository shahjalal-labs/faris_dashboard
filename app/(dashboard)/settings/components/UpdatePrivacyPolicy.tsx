"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";

import MYTextEditor from "@/components/Common/MYTextEditor";
import {
  useGetAllPrivacyPolicyQuery,
  useUpdatePrivayMutation,
} from "@/redux/api/content.api";
import { useGetMyProfileQuery } from "@/redux/api/authApi";

export function UpdatePrivacyPolicy({ pkey }: any) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");

  const { data: terms } = useGetAllPrivacyPolicyQuery(pkey);
  const { data: profile } = useGetMyProfileQuery("");
  const editable = Boolean(profile?.result?.editing);

  const [updatePrivacy, { isLoading }] = useUpdatePrivayMutation();
  const [overview, setOverview] = useState(terms?.result[0]?.content);

  useEffect(() => {
    if (terms?.result?.[0]?.content) {
      setContent(terms.result[0].content);
    }
  }, [terms]);

  const handleUpdateTerms = async () => {
    const data = {
      content: overview,
      key: pkey,
    };
    try {
      const response = await updatePrivacy(data).unwrap();

      setOpen(false);
    } catch (err) {
      console.error("Error al actualizar:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          disabled={!editable}
          className="flex items-center gap-2 font-medium text-white text-[12px] bg-bprimary disabled:cursor-not-allowed cursor-pointer rounded-lg px-2 md:px-6 py-2 "
        >
          Update Privacy {pkey == "User" ? "Policy" : "Offers"}
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[700px] bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-slate-100">
            {" "}
            Privacy {pkey == "User" ? "Policy" : "Offers"}
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Update Privacy {pkey == "User" ? "Policy" : "Offers"}
          </DialogDescription>
        </DialogHeader>

        <div>
          {/* <ReactQuill
            className="my-3 h-[300px]"
            value={content}
            onChange={handleChange}
          /> */}
          <MYTextEditor
            name="content"
            label=""
            required={true}
            content={content}
            onChangeHandler={(value) => setOverview(value)}
          />
        </div>

        <button
          onClick={handleUpdateTerms}
          className="bg-bprimary px-4 mt-8 py-2 text-white rounded-md"
          disabled={!content || isLoading}
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
      </DialogContent>
    </Dialog>
  );
}
