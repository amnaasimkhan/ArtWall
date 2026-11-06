import { RouterProvider } from 'react-router-dom';
import mainRouter from "./routes/main.jsx"
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51STiQHEFtE3etmZrjwH7Zh7S0w57GnfZ8AeyKlfPX17j1tsl4IiSnLFXE7MxYFqqjy8iAi2qH70XbJ60IA2P0IWs00aHIbhbw5"); //publishable key

function App() {
  return (
    <>
      <div>
        <Elements stripe={stripePromise}>
          <RouterProvider router={mainRouter} />
        </Elements>
      </div>

    </>
  )
}

export default App




