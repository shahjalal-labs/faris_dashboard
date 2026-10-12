
import TopRatedBusiness from './components/TopRatedBusiness';
import TopClients from './components/TopClients';
import AllMostRequested from '@/components/overview/AllTopSelling';

const InsightPage = () => {
    return (
        <div>
           <TopRatedBusiness></TopRatedBusiness>
           <AllMostRequested title="Most Requested Services" count={5}></AllMostRequested>
           {/* <MostRequested></MostRequested> */}
           <TopClients></TopClients>
        </div>
    );
};

export default InsightPage;