import SearchForm from "@/components/Home-comp/searchForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
        <SearchForm />
      </div>
    </div>
  );
}
