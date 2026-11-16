const STYLES = {
  pending: { label: "Awaiting response", cls: "bg-amber-50 text-amber-700" },
  accepted: { label: "Accepted", cls: "bg-emerald-50 text-emerald-700" },
  rejected: { label: "Rejected", cls: "bg-red-50 text-red-600" },
};

const ProposalStatusBadge = ({ status }) => {
  const s = STYLES[status] || STYLES.pending;
  return (
    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap ${s.cls}`}>
      {s.label}
    </span>
  );
};

export default ProposalStatusBadge;