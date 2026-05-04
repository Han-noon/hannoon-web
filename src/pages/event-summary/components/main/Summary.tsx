import img from '@/assets/back1.jpg';

const Summary = () => {
  return (
    <article className="w-8/12 border-r-2 border-gray47 flex flex-col items-center py-8">
      <div className="w-3/5 mb-5">
        <img src={img} alt="임시이미지" />
        <img src={img} alt="임시이미지" />
        <img src={img} alt="임시이미지" />
      </div>
      <div className="w-full px-16">
        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece
        of classical Latin literature from 45 BC, making it over 2000 years old. <br />
        <br />
        Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one
        of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through
        the cites of the word in classical literature, discovered the undoubtable source.
        <br />
        <br />
        Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The
        Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the
        theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem
        ipsum dolor sit amet..", comes from a line in section 1.10.32.
      </div>
    </article>
  );
};

export default Summary;
