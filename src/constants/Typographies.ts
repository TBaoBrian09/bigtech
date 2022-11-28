import Typography from '../models/typography';
import {responsiveFont} from './Layout';

const typographies: Typography = {
  footnote: responsiveFont(13),
  subhead: responsiveFont(14),
  body: responsiveFont(16),
  subTitle: responsiveFont(15),
  label: responsiveFont(12),
  input: responsiveFont(16),
  h3: responsiveFont(18),
  h2: responsiveFont(20),
  h1: responsiveFont(24),
  title: responsiveFont(28),
};

export default typographies;
