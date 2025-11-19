'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface FeatureDetail {
  title: string;
  icon: string;
  description: string;
  benefits: string[];
  highlights: string[];
}

interface FeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: FeatureDetail | null;
}

export function FeatureModal({ isOpen, onClose, feature }: FeatureModalProps) {
  if (!feature) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-5xl">{feature.icon}</span>
            <DialogTitle className="text-2xl">{feature.title}</DialogTitle>
          </div>
          <DialogDescription className="text-base text-foreground">
            {feature.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Benefits Section */}
          <div>
            <h4 className="font-semibold text-lg mb-3">Key Benefits:</h4>
            <ul className="space-y-2">
              {feature.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500 mt-1 flex-shrink-0">✓</span>
                  <span className="text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Highlights Section */}
          <div>
            <h4 className="font-semibold text-lg mb-3">How It Works:</h4>
            <div className="space-y-3">
              {feature.highlights.map((highlight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <p className="text-sm">{highlight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
