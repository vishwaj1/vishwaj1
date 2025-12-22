import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { insertContactSchema } from "@shared/schema";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaTwitter, FaPaperPlane, FaSpinner } from 'react-icons/fa';

export function ContactSection() {
  const { ref, isIntersecting } = useIntersectionObserver();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: ""
    }
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("https://formspree.io/f/xpwrwgeo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        toast({
          title: "Message sent!",
          description: "Thank you for your message. I'll get back to you soon.",
        });
        form.reset();
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 bg-secondary/20" ref={ref}>
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Let's discuss your next project or opportunity
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isIntersecting ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Let's Connect</h3>
              <p className="text-muted-foreground leading-relaxed">
                As a software engineer, I enjoy creating full-stack applications, automating workflows, and integrating AI to solve real-world problems. Whether you're building scalable systems, streamlining backend services, or exploring smarter ways to work with data, I'd love to connect!
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-background rounded-xl border border-border shadow-sm">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <FaEnvelope size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-foreground font-medium">vishwanthreddy2601@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-background rounded-xl border border-border shadow-sm">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <FaPhone size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-foreground font-medium">+14439922881</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-background rounded-xl border border-border shadow-sm">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <FaMapMarkerAlt size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="text-foreground font-medium">Charlotte, NC</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 pt-4">
              <a
                href="https://github.com/vishwaj1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center rounded-full bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all shadow-sm hover:shadow-md"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/jvvr/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center rounded-full bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all shadow-sm hover:shadow-md"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center rounded-full bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all shadow-sm hover:shadow-md"
              >
                <FaTwitter size={20} />
              </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isIntersecting ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-card p-8 rounded-2xl border border-border shadow-sm"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your name"
                          className="bg-background border-input text-foreground focus:ring-primary focus:border-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          className="bg-background border-input text-foreground focus:ring-primary focus:border-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Company (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your company"
                          className="bg-background border-input text-foreground focus:ring-primary focus:border-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Message</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Tell me about your project..."
                          className="bg-background border-input text-foreground focus:ring-primary focus:border-primary resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <FaPaperPlane className="ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
