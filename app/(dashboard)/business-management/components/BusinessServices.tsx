import Services from "./Services";
import Offers from "./Offers";

const BusinessServices = ({ id }: any) => {
  return (
    <div>
      <Services id={id}></Services>
      <Offers id={id}></Offers>
    </div>
  );
};

export default BusinessServices;
