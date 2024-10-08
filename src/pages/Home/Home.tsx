import { useState, useEffect, useCallback } from "react";
import { client } from "../../utils/utils";
import { Schema } from "../../../amplify/data/resource";
import { ProfileForm } from "../../components/Home-comp/profileForm";
import { ResponseAccordion } from "../../components/Home-comp/responseAccordion";

export default function Home() {
  const [industries, setIndustries] = useState<
    Array<Schema["Industries"]["type"]>
  >([]);

  const [responses, setResponses] = useState<
    Array<Schema["Responses"]["type"]>
  >([]);

  const fetchResponses = useCallback(() => {
    client.models.Responses.observeQuery().subscribe({
      next: (data) => setResponses([...data.items]),
    });
  }, []);

  useEffect(() => {
    client.models.Industries.observeQuery().subscribe({
      next: (data) => setIndustries([...data.items]),
    });

    fetchResponses();
  }, []);

  const handleResponseAdded = useCallback(() => {
    fetchResponses();
  }, [fetchResponses]);

  return (
    <div className="flex items-start min-h-screen px-4 pt-4">
      <div className="w-full max-w-8xl p-6 bg-white rounded-lg shadow-md flex gap-6">
        <div className="w-1/3">
          <ProfileForm industries={industries} onResponseAdded={handleResponseAdded} />
        </div>
        <div className="w-2/3">
          <h2 className="text-2xl font-bold mb-4">Latest Responses</h2>
          <ResponseAccordion responses={responses} />
        </div>
      </div>
    </div>
  );
}