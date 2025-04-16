import React from "react";

interface ExternalLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

function ExternalLink({ ...props }: ExternalLinkProps) {
  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}

export default ExternalLink;
