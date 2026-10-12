"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateFaqMutation } from "@/redux/api/content.api";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useGetMyProfileQuery } from "@/redux/api/authApi";

const AddFaqModal = () => {
  const [createFaq, { isLoading }] = useCreateFaqMutation();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

    const { data: profile } = useGetMyProfileQuery("");
  const editable = Boolean(profile?.result?.editing);

  const resetForm = () => {
    setQuestion("");
    setAnswer("");
  };

  const isSubmitDisabled = !question.trim() || !answer.trim() || isLoading;

  const handleCreate = async () => {
    const trimmedQuestion = question.trim();
    const trimmedAnswer = answer.trim();

    if (!trimmedQuestion || !trimmedAnswer) {
      toast.warning("Question and answer are required");
      return;
    }

    const payload = {
      question: trimmedQuestion,
      answer: trimmedAnswer,
    };

    try {
      const response = await createFaq(payload).unwrap();

      if (response?.success) {
        toast.success(response?.message || "FAQ added successfully");
        setOpen(false);
        resetForm();
      }
    } catch (error) {
      toast.warning(
        (error as { data?: { message?: string } })?.data?.message ||
          "Failed to add FAQ",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button disabled={!editable} className="cursor-pointer disabled:cursor-not-allowed flex gap-1 font-medium items-center bg-bprimary text-white rounded-4xl px-5 py-2 ">
          <Plus size={20}></Plus> Add Faq
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl rounded-lg bg-white dark:bg-slate-900 p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Add FAQ
          </DialogTitle>
        </DialogHeader>

        <div className="mt-3 space-y-5">
          <div className="space-y-2">
            <Label
              htmlFor="question"
              className="text-sm font-medium text-[#2D2D2D]"
            >
              Question
            </Label>
            <Input
              id="question"
              name="question"
              placeholder="Write question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              className="h-12 rounded-xl border-[#D1D6DB] px-4"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="answer"
              className="text-sm font-medium text-[#2D2D2D]"
            >
              Answer
            </Label>
            <Textarea
              id="answer"
              name="answer"
              placeholder="Write answer"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              className="min-h-28 rounded-xl border-[#D1D6DB] px-4 py-3"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-lg"
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <button
              type="button"
              className="rounded-lg bg-bprimary disabled:bg-gray-400 cursor-pointer px-4 py-1 text-white"
              onClick={handleCreate}
              disabled={isSubmitDisabled}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </span>
              ) : (
                "Create"
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddFaqModal;
