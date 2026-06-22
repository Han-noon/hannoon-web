import { Link } from 'react-router-dom';

type Props = {
  path: string;
  name: string;
  is_subscribed: boolean | null;
};

const ShortcutButton = ({ path, name, is_subscribed }: Props) => {
  return (
    <button>
      <Link
        to={path}
        state={{ is_subscribed }}
        className="flex items-center justify-end bg-gray47 my-6 py-1 px-3 text-xs text-white rounded-full hover:bg-[#211D1E]"
      >
        <p>{name}</p>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </div>
      </Link>
    </button>
  );
};

export default ShortcutButton;
