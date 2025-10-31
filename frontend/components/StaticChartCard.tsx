import Image from "next/image";

// Define the base URL for your backend images
const IMAGE_API_URL = "http://127.0.0.1:8000/api/images";

interface ChartCardProps {
  title: string;
  description: string;
  imgSrc: string; // e.g., "feature_importance.svg"
}

export default function StaticChartCard({
  title,
  description,
  imgSrc,
}: ChartCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      {/* We set a fixed height container for the image */}
      <div className="relative w-full h-80 border rounded-md p-2">
        <Image
          src={`${IMAGE_API_URL}/${imgSrc}`}
          alt={title}
          fill
          style={{ objectFit: "contain" }}
          unoptimized={true} // Fixes the 400 Bad Request / CORS errors
        />
      </div>
    </div>
  );
}
