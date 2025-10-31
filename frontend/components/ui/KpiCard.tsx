interface KpiCardProps {
  title: string;
  value: string | number;
  icon?: string; // Optional emoji icon
}

export default function KpiCard({ title, value, icon }: KpiCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
      {icon && <div className="text-3xl">{icon}</div>}
      <div>
        <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
        <dd className="mt-1 text-3xl font-semibold text-gray-900">{value}</dd>
      </div>
    </div>
  );
}
