import { Button } from "@/components/ui/button";

export default function TestingComp() {
  function getUser() {
    try {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          "X-API-KEY": "6o94JX4S.o0f3nQazq/tbSDCbnpzaYV0+tfC7Nxtns5KqS9Onfvw=",
        },
      };

      fetch(
        "https://api2.unipile.com:13212/api/v1/users/gordana-deleva-9a3b6a230?linkedin_sections=%2A&account_id=2FwwXfeeRMy7bvc7-90fBQ",
        options
      )
        .then((response) => response.json())
        .then((response) => console.log(response))
        .catch((err) => console.error(err));
    } catch (error) {
      console.error("Failed to get user profile:", error);
    }
  }

  return (
    <div>
      <Button onClick={getUser}>Test</Button>
    </div>
  );
}
