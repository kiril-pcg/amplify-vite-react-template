import { Button } from "@/components/ui/button";

export default function TestingComp() {
  function getUser() {
    try {
      const url = "https://api2.unipile.com:13212/api/v1/users/kiril-pepovski-231620a2?linkedin_sections=%2A&account_id=2FwwXfeeRMy7bvc7-90fBQ";

      const options = {
        method: 'GET',
        headers: {
          'X-API-KEY': '6o94JX4S.o0f3nQazq/tbSDCbnpzaYV0+tfC7Nxtns5KqS9Onfvw=',
          'Accept': 'application/json'
        }
      };
      
      fetch(url, options)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
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


// const url =
// "https://api2.unipile.com:13212/api/v1/linkedin/search?account_id=2FwwXfeeRMy7bvc7-90fBQ";

// const options = {
// method: "POST",
// headers: {
//   "X-API-KEY": "6o94JX4S.o0f3nQazq/tbSDCbnpzaYV0+tfC7Nxtns5KqS9Onfvw=",
//   accept: "application/json",
//   "content-type": "application/json",
// },
// body: JSON.stringify({
//   api: "classic",
//   category: "people",
//   keywords: "developer",
//   tenure: [{ min: 5 }],
//   profile_language: ["en"],
// }),
// };

// fetch(url, options)
// .then((response) => response.json())
// .then((data) => console.log(data))
// .catch((error) => console.error("Error:", error));