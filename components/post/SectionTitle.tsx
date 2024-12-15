import Typography from '../Text';
import React from "react";

interface SectionTitleProps {
  title: string;
  icon: React.ReactNode;
  locale: string
}

const SectionTitle = ({ title, icon,locale }: SectionTitleProps) => {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <Typography variant="h2" locale={locale}>
        {title}
      </Typography>
    </div>
  );
};

export default SectionTitle;
