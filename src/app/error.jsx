'use client';

export default function Error({ reset }) {
  return (
    <div className="error">
      <h2>Something went wrong!</h2>
      <p> Please Try again after sometime!</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
