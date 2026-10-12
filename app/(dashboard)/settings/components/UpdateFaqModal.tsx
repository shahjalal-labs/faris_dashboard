"use client";

import { useEffect, useMemo, useState } from "react";

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
import { useGetMyProfileQuery } from "@/redux/api/authApi";
import { useFaqQuery, useUpdateFaqMutation } from "@/redux/api/content.api";
import { Edit2, Loader2 } from "lucide-react";
import { toast } from "sonner";

const UpdateFaqModal = ({ id }: any) => {
  const { data: faq } = useFaqQuery(id);
  const [updateFaq, { isLoading }] = useUpdateFaqMutation();
  const { data: profile } = useGetMyProfileQuery("");

  const editable = Boolean(profile?.result?.editing);
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [initialQuestion, setInitialQuestion] = useState("");
  const [initialAnswer, setInitialAnswer] = useState("");

  useEffect(() => {
    const currentQuestion = faq?.result?.question ?? "";
    const currentAnswer = faq?.result?.answer ?? "";

    setQuestion(currentQuestion);
    setAnswer(currentAnswer);
    setInitialQuestion(currentQuestion);
    setInitialAnswer(currentAnswer);
  }, [faq?.result?.answer, faq?.result?.question]);

  const hasChanges = useMemo(() => {
    return (
      question.trim() !== initialQuestion.trim() ||
      answer.trim() !== initialAnswer.trim()
    );
  }, [answer, initialAnswer, initialQuestion, question]);

  const isSubmitDisabled =
    !question.trim() || !answer.trim() || !hasChanges || isLoading;

  const resetForm = () => {
    setQuestion(initialQuestion);
    setAnswer(initialAnswer);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      resetForm();
    }
  };

  const handleUpdate = async () => {
    const trimmedQuestion = question.trim();
    const trimmedAnswer = answer.trim();

    if (!trimmedQuestion || !trimmedAnswer) {
      toast.warning("Question and answer are required");
      return;
    }

    if (!hasChanges) {
      return;
    }

    try {
      const response = await updateFaq({
        faqId: id,
        question: trimmedQuestion,
        answer: trimmedAnswer,
      }).unwrap();

      if (response?.success) {
        toast.success(response?.message || "FAQ updated successfully");
        setOpen(false);
      }
    } catch (error) {
      toast.warning(
        (error as { data?: { message?: string } })?.data?.message ||
          "Failed to update FAQ",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          disabled={!editable}
          className="cursor-pointer disabled:cursor-not-allowed text-gray-500 disabled:text-gray-400 dark:text-slate-400 flex items-center gap-1 rounded-md px-2 py-1  transition-colors"
        >
          <Edit2 size={20} />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl rounded-lg bg-white dark:bg-slate-900 p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-slate-100">
            Update FAQ
          </DialogTitle>
        </DialogHeader>

        <div className="mt-3 space-y-5">
          <div className="space-y-2">
            <Label
              htmlFor={`question-${id}`}
              className="text-sm font-medium text-[#2D2D2D] dark:text-slate-200"
            >
              Question
            </Label>
            <Input
              id={`question-${id}`}
              name="question"
              placeholder="Write question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              className="h-12 rounded-xl border-[#D1D6DB] px-4"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor={`answer-${id}`}
              className="text-sm font-medium text-[#2D2D2D] dark:text-slate-200"
            >
              Answer
            </Label>
            <Textarea
              id={`answer-${id}`}
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
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <button
              type="button"
              className="rounded-lg bg-bprimary disabled:bg-gray-400 cursor-pointer px-4 py-1 text-white"
              onClick={handleUpdate}
              disabled={isSubmitDisabled}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </span>
              ) : (
                "Update"
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateFaqModal;
