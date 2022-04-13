import Link from 'next/link';

const NextLink = (props: any) => {
  const { href, children, ...rest } = props;
  return (
    <Link href={href}>
      <a {...rest}>{children}</a>
    </Link>
  );
};

export default NextLink;
