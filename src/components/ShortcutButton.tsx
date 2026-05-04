import { Link } from 'react-router-dom';

type Props = {
  path: string;
  name: string;
};

const ShortcutButton = ({ path, name }: Props) => {
  return (
    <Link
      to={path}
      className="text-sm flex items-center justify-end px-2 text-blue-600 my-6 hover:underline hover:underline-offset-4"
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
  );
};

export default ShortcutButton;
