import Link from 'next/link';

// type CustomProps = {
//   href: string;
//   children: React.ReactNode;
//   rest: any;
// };

// const NextLink: React.FC<CustomProps> = ({ href, children, ...rest }) => {
const NextLink = (props: any) => {
  const { href, children, ...rest } = props;
  return (
    <Link href={href}>
      <a {...rest}>{children}</a>
    </Link>
  );
};

export default NextLink;
