import { memo } from "react";

const Child = memo(({ text, onClick }) => {
  console.log(`${text} button rendered`);
  return (
    <div>
      <button onClick={onClick}>{text}</button>
    </div>
  );
});

export default Child;
