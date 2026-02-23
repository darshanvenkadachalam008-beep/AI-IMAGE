import { Phone, Mail } from "lucide-react";

const ContactPanel = () => {
  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4 flex justify-center">
        <div className="relative max-w-lg w-full rounded-2xl border border-ember/30 bg-card p-8 shadow-ember-md overflow-hidden">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-ember/50 rounded-tl-2xl" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-ember/50 rounded-br-2xl" />

          <h3 className="text-2xl font-bold bg-gradient-to-r from-flame to-ember bg-clip-text text-transparent mb-2 text-center">
            Get in Touch
          </h3>
          <p className="text-muted-foreground text-center text-sm mb-8">
            For collaborations, projects, or AI solutions — get in touch.
          </p>

          <div className="space-y-5">
            <a
              href="tel:8015054090"
              className="flex items-center gap-4 p-4 rounded-xl border border-ember/20 bg-ember/5 hover:bg-ember/10 hover:shadow-ember-sm transition-all group"
            >
              <div className="w-12 h-12 rounded-full border border-ember/40 flex items-center justify-center group-hover:shadow-ember-sm transition-all">
                <Phone className="w-5 h-5 text-ember" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-foreground font-medium">8015054090</p>
              </div>
            </a>

            <a
              href="mailto:darshanvenkadachalam008@gmail.com"
              className="flex items-center gap-4 p-4 rounded-xl border border-ember/20 bg-ember/5 hover:bg-ember/10 hover:shadow-ember-sm transition-all group"
            >
              <div className="w-12 h-12 rounded-full border border-ember/40 flex items-center justify-center group-hover:shadow-ember-sm transition-all">
                <Mail className="w-5 h-5 text-ember" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-foreground font-medium text-sm break-all">
                  darshanvenkadachalam008@gmail.com
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPanel;
