import { useState, useEffect } from "react";
import { Schema } from "../../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

export default function Industries() {
  const [industries, setIndustries] = useState<
    Array<Schema["Industries"]["type"]>
  >([]);

  useEffect(() => {
    client.models.Industries.observeQuery().subscribe({
      next: (data) => setIndustries([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Industries.create({
      prompt: window.prompt("prompt content"),
    });
  }

  function deleteIndustrie(id: string) {
    client.models.Industries.delete({ id });
  }

  return (
    <div>
      <h1>Industries:</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {industries.map((industrie) => (
          <li
            onClick={() => {
              deleteIndustrie(industrie.id);
            }}
            key={industrie.id}
          >
            {industrie.prompt}
          </li>
        ))}
      </ul>
    </div>
  );
}
