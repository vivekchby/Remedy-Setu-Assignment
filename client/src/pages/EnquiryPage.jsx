import { useState } from "react";
import Header from "../components/Header";
import api from "../services/api";

const PRODUCT_OPTIONS = ["Gemstones", "Rudraksha", "Puja services"];

export default function EnquiryPage() {
  const [form, setForm] = useState({
    name: "", phone: "", city: "", businessType: "Astrologer",
    productsOfInterest: []
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function toggleProduct(product) {
    const selected = form.productsOfInterest.includes(product);
    setForm({
      ...form,
      productsOfInterest: selected
        ? form.productsOfInterest.filter((item) => item !== product)
        : [...form.productsOfInterest, product]
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      await api.post("/leads", form);
      setMessage("Thank you! Your enquiry has been submitted.");
      setForm({
        name: "", phone: "", city: "", businessType: "Astrologer",
        productsOfInterest: []
      });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to submit enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main className="public-shell">
        <section className="intro">
          <p className="eyebrow">REMEDY SETU</p>
          <h1>Let’s grow your business together.</h1>
          <p>Share your requirements and our team will get in touch with you.</p>
        </section>

        <form className="panel enquiry-form" onSubmit={handleSubmit}>
          <div className="panel-heading">
            <h2>Submit an enquiry</h2>
            <p>All fields are required.</p>
          </div>

          <label>
            Full name
            <input name="name" value={form.name} onChange={updateField} placeholder="Enter your name" required maxLength="80" />
          </label>

          <label>
            Phone number
            <input name="phone" type="tel" value={form.phone} onChange={updateField} placeholder="Enter your phone number" required pattern="[0-9+() -]{7,20}" />
          </label>

          <label>
            City
            <input name="city" value={form.city} onChange={updateField} placeholder="Enter your city" required maxLength="80" />
          </label>

          <label>
            Business type
            <select name="businessType" value={form.businessType} onChange={updateField} required>
              <option>Astrologer</option>
              <option>Retailer</option>
            </select>
          </label>

          <fieldset>
            <legend>Products of interest</legend>
            <div className="checkbox-list">
              {PRODUCT_OPTIONS.map((product) => (
                <label className="checkbox-option" key={product}>
                  <input
                    type="checkbox"
                    checked={form.productsOfInterest.includes(product)}
                    onChange={() => toggleProduct(product)}
                  />
                  {product}
                </label>
              ))}
            </div>
          </fieldset>

          {error && <p className="alert alert-error">{error}</p>}
          {message && <p className="alert alert-success">{message}</p>}

          <button className="button button-primary button-full" disabled={loading || form.productsOfInterest.length === 0}>
            {loading ? "Submitting..." : "Submit enquiry"}
          </button>
        </form>
      </main>
      <footer className="footer">Remedy Setu · Enquiry</footer>
    </>
  );
}
