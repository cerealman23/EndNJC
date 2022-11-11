require 'csv'
# 1 -> year
# 3 -> state
# 4 -> county
# 5 -> total_pop 


class FormData

  attr_accessor :years

  def initialize

    @years = (1970..2018)

  end

  def extract_county county

    county.split[0]

  end




  def data_based_on_year 
    csv = CSV.read("incarceration_trends.csv")
    total = 0

    # csv.each do | item |

    @years.each do | year |

      pp year
    final_struct = [] 
    count = 0
      csv.each do | row |
        count += 1
        if (row[1].to_i == year) 
          fips = row[2]
          if row[2].length < 5
            fips = fips.insert(0, "0")
          end
          final_struct << [fips, extract_county(row[4]), row[95], row[1]]
        end 

      end

      pp count

      puts "Writing for #{year}"
      write_to_csv final_struct, year

    end

    # end

  end
  def write_to_csv data, year
    CSV.open("./csv/county-prison-#{year}.csv", "wb") do | csv |

      csv << ["fips", "county", "rate", "year"] 

      data.each do | row |

        if row[1] == nil
          row[1] = 0
        end

        csv << [row[0], row[1], row[2], row[3]]

      end

    end
  end
end

form = FormData.new
form.data_based_on_year
