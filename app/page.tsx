import Navbar from "@/components/navbar/Navbar";
import Hero from "@/components/hero/Hero";
import Banner from "@/components/banner/Banner";
import Categories from "@/components/categories/Categories";
import Products from "@/components/products/Products";
import Footer from "@/components/footer/Footer";
import Container from "@/components/ui/Container";

export default function Home() {
  return (
    <>
      <Navbar />

      <Container>
        <Banner />
        <Categories />
        <Products />
      </Container>

      <Footer />
    </>
  );
}