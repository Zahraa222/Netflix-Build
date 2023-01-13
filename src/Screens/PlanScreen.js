import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/counter/userSlice";
import db from "../firebase";
import "./PlanScreen.css";
import { loadStripe } from "@stripe/stripe-js";

function PlanScreen() {
  const [products, setProducts] = useState([]);
  const user = useSelector(selectUser);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    db.collection("customers")
      .doc(user.uid)
      .collection("subscriptions")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async (subscription) => {
          setSubscription({
            role: subscription.data().role,
            current_period_end: subscription.data().current_period_end.seconds,
            current_period_start:
              subscription.data().current_period_start.seconds,
          });
        });
      });
  }, [user.uid]);

  useEffect(() => {
    db.collection("products")
      .where("active", "==", true)
      .get()
      .then((querySnapshot) => {
        const products = {};
        querySnapshot.forEach(async (productDoc) => {
          products[productDoc.id] = productDoc.data(); //data inside the plan
          const priceSnap = await productDoc.ref.collection("prices").get();
          priceSnap.docs.forEach((price) => {
            products[productDoc.id].prices = {
              priceId: price.id,
              priceData: price.data(),
            };
          });
        });
        setProducts(products);
      });
  }, []);

  console.log(products);
  console.log(subscription);

  const loadCheckout = async (priceId) => {
    const docRef = await db
      .collection("customers")
      .doc(user.uid)
      .collection("checkout_sessions")
      .add({
        price: priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      });
    docRef.onSnapshot(async (snap) => {
      const { error, sessionId } = snap.data();

      if (error) {
        //show an error to your customer & inspect your cloud function logs in the firebase console.
        alert(`An error occured: ${error.message}`);
      }

      if (sessionId) {
        //redirecting session to checkout
        //init stripe
        const stripe = await loadStripe(
          "pk_test_51MOENrGGvsr1xvMiVV72ZihpLLvn2gEadxswFuxyjLZOT57ZNkp12o4uJBdlOMNQxvqqEjoXCTqPlxhXaCF8Wk2A00W0MVA5sh" //STRIPE API KEY
        );
        /* card test info:
        card#: 4242 4242 4242 4242
        Month/Year: 42/42
        CVC: 424
        Name: any string */
        stripe.redirectToCheckout({ sessionId });
      }
    });
  };

  return (
    <div className="planScreen">
      {subscription && (
        <p>
          Renewal date:{" "}
          {new Date(
            subscription?.current_period_end * 1000
          ).toLocaleDateString()}
        </p>
      )}
      {Object.entries(products).map(([productId, productData]) => {
        //key and value pairs as arrays
        //add some logic to check if the user's subscription is active...
        const isCurrentPackage = productData.name
          ?.toLowerCase()
          .includes(subscription?.role);
        return (
          <div
            key={productId}
            className={`${
              isCurrentPackage && "planScreen_plan--disabled"
            } planScreen_plan`}
          >
            <div className="planScreen_info">
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>
            <button
              onClick={() =>
                !isCurrentPackage && loadCheckout(productData.prices.priceId)
              }
            >
              {isCurrentPackage ? "Current Package" : "Subscribe"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default PlanScreen;
