export default function KeyboardButton({children, className, onMouseDown, onMouseUp}) {
  return <>
    <button
      className={"min-w-11 py-2 px-2.5 shadow-md border rounded text-neutral-50 font-bold bg-sky-600 hover:bg-sky-700 border-sky-700 " + className}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onMouseDown}
      onTouchEnd={onMouseUp}
    >
      {children}
    </button>
  </>;
}
