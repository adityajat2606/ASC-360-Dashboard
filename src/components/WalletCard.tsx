interface WalletCardProps {
  balance: number | string;
}

export default function WalletCard({ balance }: WalletCardProps) {
  return (
    <div className="rounded-xl p-6 text-primary-foreground min-w-[220px]"
      style={{
        background: "linear-gradient(135deg, hsl(25 95% 53%), hsl(0 80% 60%))",
      }}
    >
      <p className="text-sm font-medium opacity-90">Wallet</p>
      <p className="text-xs opacity-80 mt-1">Available Balance</p>
      <p className="text-2xl font-bold mt-1">
        INR {typeof balance === "number" ? balance.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : balance}
      </p>
    </div>
  );
}
