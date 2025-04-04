import Link from 'next/link';
import { Brain } from 'lucide-react';
import { BrainMoney } from '../atoms/icons/brain-money';

const Header = () => {
  return (
    <header className="bg-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <BrainMoney className="h-6 w-6" />
          <span className="font-bold">BudgetBrain</span>
        </Link>
      </div>
    </header>
  );
};

export default Header; 