export default function Review({ review, sessionUser }) {
  return (
    <div>
      <h3>{review.User && review.User.firstName}</h3>
      <h4>
        {review.createdAt && review.createdAt.month} {review.createdAt.year}
      </h4>
      <p>{review.review && review.review}</p>
      {sessionUser.user.id === review.User.id && <button>Delete</button>}
    </div>
  );
}
