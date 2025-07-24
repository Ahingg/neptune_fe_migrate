import { Link } from "react-router-dom";

interface ActionCardProps {
    to: string;
    icon: string;
    title: string;
    description: string;
}

const ActionCard: React.FC<ActionCardProps> = ({
    to,
    icon,
    title,
    description,
}) => (
    <Link
        to={to}
        className="card bg-base-300 border border-gray-600   shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 rounded-xl p-6 flex flex-col items-center gap-2 text-center cursor-pointer group"
    >
        <span className="material-icons text-blue-500 text-4xl mb-2 group-hover:text-blue-700 transition-colors">
            {icon}
        </span>
        <h2 className="card-title text-xl font-bold text-blue-700 group-hover:text-blue-300">
            {title}
        </h2>
        <p className="text-gray-600 text-sm">{description}</p>
    </Link>
);

export default ActionCard;