import "./SkeletonCard.css";

export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-card__image skeleton-shine" />
      <div className="skeleton-card__body">
        <div className="skeleton-card__line skeleton-shine" style={{ width: "60%" }} />
        <div className="skeleton-card__line skeleton-shine" style={{ width: "40%" }} />
        <div className="skeleton-card__footer">
          <div className="skeleton-card__price skeleton-shine" />
          <div className="skeleton-card__btn skeleton-shine" />
        </div>
      </div>
    </div>
  );
}