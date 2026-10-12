"use client";

import React, { useState } from "react";
import { useGetAllPrivacyPolicyQuery } from "@/redux/api/content.api";
import { DialogContent } from "@/components/ui/dialog";
import MYTextEditor from "./MyTextEditor";
// import { ImSpinner3 } from 'react-icons/im';

const EditPrivacyPolicyModal = () => {
  const { data } = useGetAllPrivacyPolicyQuery("User");

  const [overview, setOverview] = useState(data?.result[0]?.content);

  return (
    <DialogContent
      className="max-h-[80vh] md:min-w-xl overflow-x-hidden overflow-y-auto bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700"
      showCloseButton
    >
      <h1 className="text-2xl font-semibold text-[#2D2D2D] dark:text-slate-100 pb-4">
        Edit Privacy Policy
      </h1>

      <form
      // onSubmit={handleSubmit}
      >
        <MYTextEditor
          name="content"
          label=""
          required={true}
          content={overview}
          onChangeHandler={(value) => setOverview(value)}
        />

        {/* Save Button */}
        <div className="flex justify-center items-center mt-8">
          <button
            type="submit"
            // disabled={isChanging || !overview}
            className="bg-[#27A365] hover:bg-[#27A365D9] text-white text-lg font-medium rounded-full px-8 py-2 transition-all duration-300 cursor-pointer flex items-center gap-2 disabled:opacity-70"
          >
            Save
            {/* {isChanging ? (
                            <>
                                Saving...
                                <span className="animate-spin">
                                    <ImSpinner3 />
                                </span>
                            </>
                        ) : (
                            "Save"
                        )} */}
          </button>
        </div>
      </form>
    </DialogContent>
  );
};

export default EditPrivacyPolicyModal;
