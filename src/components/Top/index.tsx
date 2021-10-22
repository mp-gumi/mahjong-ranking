import Link from "next/link";
import React from "react";

function Top(): JSX.Element {
  return (
    <div>
      <Link href="/input" passHref={true}>
        <a>入力ページへ</a>
      </Link>
    </div>
  );
}

export default Top;
