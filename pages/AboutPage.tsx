
import React from 'react';
import { Branding } from '../constants';

export const AboutPage: React.FC = () => {
  return (
    <div className="page-container py-12">
      <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-8 md:p-12">
        <div className="text-center mb-10">
            <img 
                src={Branding.brand.logo.title} 
                alt={`${Branding.brand.longName} Logo`}
                className="mx-auto mb-6 h-16 sm:h-20" // Logo is an image
            />
            <h1 className="text-4xl font-extrabold text-secondary dark:text-primary">
            About {Branding.brand.shortName}
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 italic">"{Branding.brand.slogan}"</p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            <strong className="text-secondary dark:text-primary">{Branding.brand.longName}</strong> is at the forefront of artificial intelligence research and application. 
            We are dedicated to pushing the boundaries of innovation and creating intelligent solutions that drive real-world impact. 
            Our mission is to democratize AI, making its power accessible to businesses and individuals alike, fostering growth and efficiency.
          </p>
          
          <h2 className="text-secondary dark:text-primary">Our Vision</h2>
          <p>
            We envision a future where AI seamlessly integrates with human endeavors, augmenting capabilities and solving complex challenges. 
            At {Branding.brand.shortName}, we strive to be a leading catalyst in this transformation, championing ethical AI development and practical innovation.
          </p>

          <h2 className="text-secondary dark:text-primary">Core Values</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Innovation:</strong> Continuously exploring new frontiers in AI and machine learning.</li>
            <li><strong>Excellence:</strong> Committed to delivering high-quality, reliable, and effective AI solutions.</li>
            <li><strong>Integrity:</strong> Upholding the highest ethical standards in our research, development, and business practices.</li>
            <li><strong>Collaboration:</strong> Fostering partnerships and open communication to achieve shared goals.</li>
            <li><strong>Impact:</strong> Focusing on creating AI tools that provide tangible benefits and solve real problems.</li>
          </ul>

          <h2 className="text-secondary dark:text-primary">The Marketing Optimizer</h2>
          <p>
            This AI Marketing Campaign Optimizer is a testament to our commitment to practical AI. It's designed to empower marketers with
            data-driven insights and intelligent automation, helping them to refine strategies, optimize spending, and achieve superior results.
            Built with passion by the team at {Branding.brand.shortName}, we believe this tool will revolutionize how you approach your marketing efforts.
          </p>

          <div className="mt-10 pt-6 border-t border-primary dark:border-primary">
            <h3 className="font-semibold text-xl mb-2 text-secondary dark:text-primary">Connect With Us</h3>
            <p>
              Learn more about our work and explore opportunities at <a href={Branding.brand.website} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline text-secondary dark:text-primary">{Branding.brand.website}</a>.
            </p>
            <p>
              For inquiries, please contact us at <a href={`mailto:${Branding.brand.email}`} className="font-medium hover:underline text-secondary dark:text-primary">{Branding.brand.email}</a> or call us at {Branding.brand.mobile}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};