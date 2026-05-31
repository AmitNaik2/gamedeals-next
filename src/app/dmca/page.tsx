export default function Page() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-[#0F172A]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
        <h1 className="text-4xl font-orbitron font-bold text-[#06B6D4] mb-8 uppercase tracking-widest border-b border-white/10 pb-6">DMCA Policy</h1>
        
        <div className="space-y-6 text-[#9CA3AF] font-poppins leading-relaxed">
          <p>
            GamesDealsHub respects the intellectual property rights of others and expects our users to do the same. In accordance with the Digital Millennium Copyright Act of 1998, the text of which may be found on the U.S. Copyright Office website at <a href="http://www.copyright.gov/legislation/dmca.pdf" className="text-[#06B6D4] hover:underline" target="_blank" rel="noopener noreferrer">http://www.copyright.gov/legislation/dmca.pdf</a>, GamesDealsHub will respond expeditiously to claims of copyright infringement committed using the GamesDealsHub service that are reported to our Designated Copyright Agent.
          </p>

          <h2 className="text-xl font-orbitron font-bold text-white uppercase tracking-widest mt-8 mb-4">Notice of Infringement</h2>
          <p>
            If you are a copyright owner, or are authorized to act on behalf of one, or authorized to act under any exclusive right under copyright, please report alleged copyright infringements taking place on or through the Site by completing the following DMCA Notice of Alleged Infringement and delivering it to our Designated Copyright Agent.
          </p>
          
          <ul className="list-disc pl-6 space-y-3">
            <li>Identify the copyrighted work that you claim has been infringed, or - if multiple copyrighted works are covered by this Notice - you may provide a representative list of the copyrighted works that you claim have been infringed.</li>
            <li>Identify the material that you claim is infringing (or to be the subject of infringing activity) and that is to be removed or access to which is to be disabled, and information reasonably sufficient to permit us to locate the material, including at a minimum, if applicable, the URL of the link shown on the Site where such material may be found.</li>
            <li>Provide your mailing address, telephone number, and, if available, email address.</li>
            <li>Include both of the following statements in the body of the Notice:
              <ul className="list-[circle] pl-6 mt-2 space-y-2">
                <li className="italic">"I hereby state that I have a good faith belief that the disputed use of the copyrighted material is not authorized by the copyright owner, its agent, or the law (e.g., as a fair use)."</li>
                <li className="italic">"I hereby state that the information in this Notice is accurate and, under penalty of perjury, that I am the owner, or authorized to act on behalf of the owner, of the copyright or of an exclusive right under the copyright that is allegedly infringed."</li>
              </ul>
            </li>
            <li>Provide your full legal name and your electronic or physical signature.</li>
          </ul>

          <h2 className="text-xl font-orbitron font-bold text-white uppercase tracking-widest mt-8 mb-4">Designated Agent Contact</h2>
          <p>
            Deliver this Notice, with all items completed, to our Designated Copyright Agent at the following email address:
          </p>
          <div className="bg-[#050816] border border-white/5 p-4 rounded-lg inline-block">
             <a href="mailto:gamedealshub1@gmail.com" className="text-[#06B6D4] hover:text-white transition-colors font-bold tracking-wider">gamedealshub1@gmail.com</a>
          </div>

          <p className="mt-8 text-sm">
            Please note that GamesDealsHub is an aggregator of deals and links. We do not host game files, installers, or pirated software on our servers. All 'Extract Asset' links direct users to verified, official storefronts such as the Epic Games Store, Steam, or GOG.
          </p>
        </div>
      </div>
    </div>
  );
}
