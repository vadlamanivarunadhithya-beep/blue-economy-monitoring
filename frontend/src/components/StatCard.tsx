interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: string;
}

function StatCard({
  title,
  value,
  description,
  icon,
}: StatCardProps) {

  return (
    <div className="stat-card">

      <div className="stat-top">

        <div>
          <p>{title}</p>
          <h2>{value}</h2>
        </div>

        <div className="stat-icon">
          {icon}
        </div>

      </div>

      <span className="stat-description">
        {description}
      </span>

    </div>
  );
}

export default StatCard;