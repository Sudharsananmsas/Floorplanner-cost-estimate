import { Button } from "primereact/button";

import { useNavigate } from "react-router-dom";

import background from "../assets/background.png";
import Footer from "../components/Footer";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <section
        className="relative min-h-screen text-white"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="relative z-10 px-10 py-32 max-w-7xl">
          <div className="items-center py-55">
            <h1 className="text-5xl font-extrabold leading-tight drop-shadow-lg">
              Floor Plan Automation
            </h1>
            <h2 className="text-2xl mt-4 text-indigo-200 drop-shadow">
              AI-Powered Takeoff & Estimation Platform
            </h2>

            <p className="mt-6 text-lg text-white bg-black/25 max-w-xl drop-shadow">
              Automate HVAC and MEP takeoffs directly from floor plans. Reduce
              manual effort, eliminate errors, and accelerate bid preparation
              with intelligent drawing analysis.
            </p>
            <div className="mt-8 flex gap-4">
              <Button
                label="Get Started"
                icon="pi pi-arrow-right"
                className="p-button-rounded p-button-lg"
                onClick={() => navigate("/plans")}
              ></Button>
            </div>
          </div>

          <div className="hidden md:flex justify-center relative">
            {/* <img
              src={home}
              alt="Home Page Illustration"
              className=" rounded-lg h-150 max-h-lg rotate-10 scale-105 shadow-2xl shadow-black "
            /> */}
          </div>
        </div>
        <Footer />
      </section>
      {/* <section className="bg-gray-50 py-10 text-center">
        <p className="text-xl font-medium text-gray-700">
          Reduce bid preparation time from{" "}
          <span className="font-bold">days to hours</span> — with confidence and
          accuracy.
        </p>
      </section> */}

      {/* ================= PROBLEM SECTION =================
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              The Challenge with Manual Takeoffs
            </h2>
            <ul className="space-y-4 text-gray-600">
              <li>
                • Engineers spend 40–60% of bid time on manual measurements
              </li>
              <li>• Human errors lead to rework and bid inaccuracies</li>
              <li>• Scaling teams increases cost, not speed</li>
              <li>• Digital-first competitors are winning more bids</li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card title="Slow Process" />
            <Card title="Error-Prone" />
            <Card title="High Cost" />
            <Card title="Low Scalability" />
          </div>
        </div>
      </section>
      <section className="py-10 bg-linear-to-r from-indigo-500 to-purple-600 text-white text-center">
        <h2 className="text-4xl font-bold mb-6">
          Ready to Automate Your Takeoffs?
        </h2>
        <p className="mb-10 text-lg">
          Stop measuring manually. Start bidding smarter.
        </p>
      </section> */}
    </>
  );
}
