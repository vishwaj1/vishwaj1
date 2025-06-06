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
    <section id="contact" className="py-20 px-6 bg-[#111111]" ref={ref}>
      <div className="container mx-auto max-w-4xl">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text"
          initial={{ opacity: 0, y: 30 }}
          animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          Get In Touch
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isIntersecting ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-semibold mb-6">Let's Build Something Meaningful</h3>
            <p className="text-gray-300 mb-8 leading-relaxed">
            As a software engineer, I enjoy creating full-stack applications, automating workflows, and integrating AI to solve real-world problems. Whether you're building scalable systems, streamlining backend services, or exploring smarter ways to work with data, I'd love to connect and collaborate!
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-4">
                <i className="fas fa-envelope text-[hsl(var(--electric-blue))] text-xl"></i>
                <span>vishwanthreddy2601@gmail.com</span>
              </div>
              <div className="flex items-center space-x-4">
                <i className="fas fa-phone text-[hsl(var(--electric-blue))] text-xl"></i>
                <span>+14439922881</span>
              </div>
              <div className="flex items-center space-x-4">
                <i className="fas fa-map-marker-alt text-[hsl(var(--electric-blue))] text-xl"></i>
                <span>Charlotte, NC</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-6">
              <a 
                href="https://github.com/vishwaj1" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-2xl hover:text-[hsl(var(--electric-blue))] transition-colors"
              >
                <i className="fab fa-github"></i>
              </a>
              <a 
                href="https://www.linkedin.com/in/jvvr/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-2xl hover:text-[hsl(var(--electric-blue))] transition-colors"
              >
                <i className="fab fa-linkedin"></i>
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-2xl hover:text-[hsl(var(--electric-blue))] transition-colors"
              >
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </motion.div>
          
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isIntersecting ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your name" 
                          className="glass border-0 text-white placeholder-gray-400 focus:ring-2 focus:ring-[hsl(var(--electric-blue))]"
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="your.email@example.com" 
                          className="glass border-0 text-white placeholder-gray-400 focus:ring-2 focus:ring-[hsl(var(--electric-blue))]"
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
                      <FormLabel>Company (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your company" 
                          className="glass border-0 text-white placeholder-gray-400 focus:ring-2 focus:ring-[hsl(var(--electric-blue))]"
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
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={4}
                          placeholder="Tell me about your project..." 
                          className="glass border-0 text-white placeholder-gray-400 focus:ring-2 focus:ring-[hsl(var(--electric-blue))] resize-none"
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
                  className="w-full py-4 gradient-bg text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 animate-glow"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Sending...
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <i className="fas fa-paper-plane ml-2"></i>
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
