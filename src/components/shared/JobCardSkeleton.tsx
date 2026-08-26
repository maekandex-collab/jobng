interface JobCardSkeletonProps {
  variant?: "list" | "grid";
}

export const shimmer: React.CSSProperties = {
  background: "linear-gradient(100deg, #eef2f7 30%, #f8fafc 50%, #eef2f7 70%)",
  backgroundSize: "200% 100%",
  animation: "jjShimmer 1.3s ease-in-out infinite",
  borderRadius: 6,
};

function Bar({ w, h = 12, style }: { w: number | string; h?: number; style?: React.CSSProperties }) {
  return <div style={{ ...shimmer, width: w, height: h, ...style }} />;
}

export default function JobCardSkeleton({ variant = "grid" }: JobCardSkeletonProps) {
  if (variant === "list") {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-4">
        <div style={{ ...shimmer, width: 52, height: 52, borderRadius: 12, flexShrink: 0 }} />
        <div className="flex-1 w-full min-w-0 flex flex-col gap-2.5">
          <Bar w="60%" h={16} />
          <Bar w="35%" h={12} />
          <div className="flex gap-3 mt-1">
            <Bar w={70} h={11} />
            <Bar w={90} h={11} />
          </div>
          <Bar w="90%" h={11} style={{ marginTop: 4 }} />
        </div>
        <div className="w-full sm:w-auto flex sm:flex-col gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 shrink-0">
          <div style={{ ...shimmer, width: "100%", minWidth: 70, height: 36, borderRadius: 8 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 flex flex-col gap-3.5 h-full">
      <div className="flex items-start gap-3">
        <div style={{ ...shimmer, width: 48, height: 48, borderRadius: 10, flexShrink: 0 }} />
        <div className="flex-1 min-w-0 flex flex-col gap-2 pt-1">
          <Bar w="80%" h={14} />
          <Bar w="50%" h={11} />
        </div>
      </div>
      <div className="flex gap-2">
        <Bar w={70} h={11} />
        <Bar w={90} h={11} />
      </div>
      <div style={{ ...shimmer, width: "100%", height: 36, borderRadius: 8, marginTop: "auto" }} />
    </div>
  );
}