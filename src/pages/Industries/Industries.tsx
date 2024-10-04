import { useState, useEffect } from "react";
import { Schema } from "../../../amplify/data/resource";
import { columns } from "../../components/Industrie-comp/columns";
import { DataTable } from "../../components/Industrie-comp/data-table";
import { client } from "../../utils/utils"

export default function Industries() {
  const [industries, setIndustries] = useState<
    Array<Schema["Industries"]["type"]>
  >([]);

  useEffect(() => {
    client.models.Industries.observeQuery().subscribe({
      next: (data) => setIndustries([...data.items]),
    });
  }, []);

  function deleteIndustrie(id: string) {
    client.models.Industries.delete({ id });
  }

  return (
    <div>
      <DataTable columns={columns} data={industries} />
    </div>
  );
}
